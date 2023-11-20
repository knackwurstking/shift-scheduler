<script>
    import { jsPDF } from "jspdf";

    import { Button } from "svelte-css";

    const pdf = new jsPDF("portrait", "mm", "a4");
</script>

<div
    class="ui-container is-max  no-scrollbar"
    style:padding-top="3em"
    style:overflow="auto"
>
    <!-- TODO: adding a print/share button on top? -->
    <!-- TODO: pick a year? -->
    <!-- TODO: display table for each month -->

    <div id="pdf-content" data-theme="light">
        <section class="has-padding" style:margin="var(--spacing)">
            <h3>Januar</h3>

            <table>
                <thead>
                    <tr>
                        <th class="is-text-left">Mo</th>
                        <th class="is-text-left">Di</th>
                        <th class="is-text-left">Mi</th>
                        <th class="is-text-left">Do</th>
                        <th class="is-text-left">Fr</th>
                        <th class="is-text-left">Sa</th>
                        <th class="is-text-left">So</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>1</span> <span style:color="blue">N</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>2</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>3</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>4</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>5</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>6</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>7</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>8</span> <span style:color="orange">S</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>9</span> <span style:color="blue">Nacht</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>10</span> <span style:color="red">K</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>11</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>12</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>13</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>14</span> <span style:color="magenta">Ka</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>15</span> <span style:color="green">F</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>16</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>17</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>18</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>19</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>20</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>21</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>22</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>23</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>24</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>25</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>26</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>27</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>28</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>29</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>30</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>31</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section class="has-padding" style:margin="var(--spacing)">
            <h3>Februar</h3>

            <table>
                <thead>
                    <tr>
                        <th class="is-text-left">Mo</th>
                        <th class="is-text-left">Di</th>
                        <th class="is-text-left">Mi</th>
                        <th class="is-text-left">Do</th>
                        <th class="is-text-left">Fr</th>
                        <th class="is-text-left">Sa</th>
                        <th class="is-text-left">So</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>1</span> <span style:color="blue">N</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>2</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>3</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>4</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>5</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>6</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>7</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>8</span> <span style:color="orange">S</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>9</span> <span style:color="blue">Nacht</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>10</span> <span style:color="red">K</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>11</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>12</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>13</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>14</span> <span style:color="magenta">Ka</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>15</span> <span style:color="green">F</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>16</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>17</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>18</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>19</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>20</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>21</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>22</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>23</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>24</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>25</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>26</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>27</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>28</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>29</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>30</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>31</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section class="has-padding" style:margin="var(--spacing)">
            <h3>Maerz</h3>

            <table style:width="100%" style:table-layout="fixed">
                <thead>
                    <tr>
                        <th class="is-text-left">Mo</th>
                        <th class="is-text-left">Di</th>
                        <th class="is-text-left">Mi</th>
                        <th class="is-text-left">Do</th>
                        <th class="is-text-left">Fr</th>
                        <th class="is-text-left">Sa</th>
                        <th class="is-text-left">So</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>1</span> <span style:color="blue">N</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>2</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>3</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>4</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>5</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>6</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>7</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>8</span> <span style:color="orange">S</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>9</span> <span style:color="blue">Nacht</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>10</span> <span style:color="red">K</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>11</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>12</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>13</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>14</span> <span style:color="magenta">Ka</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>15</span> <span style:color="green">F</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>16</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>17</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>18</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>19</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>20</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>21</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>22</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>23</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>24</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>25</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>26</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>27</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>28</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>29</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>30</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>31</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section class="has-padding" style:margin="var(--spacing)">
            <h3>April</h3>

            <table>
                <thead>
                    <tr>
                        <th class="is-text-left">Mo</th>
                        <th class="is-text-left">Di</th>
                        <th class="is-text-left">Mi</th>
                        <th class="is-text-left">Do</th>
                        <th class="is-text-left">Fr</th>
                        <th class="is-text-left">Sa</th>
                        <th class="is-text-left">So</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>1</span> <span style:color="blue">N</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>2</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>3</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>4</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>5</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>6</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>7</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>8</span> <span style:color="orange">S</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>9</span> <span style:color="blue">Nacht</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>10</span> <span style:color="red">K</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>11</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>12</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>13</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>14</span> <span style:color="magenta">Ka</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>15</span> <span style:color="green">F</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>16</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>17</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>18</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>19</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>20</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>21</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>22</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>23</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>24</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>25</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>26</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>27</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>28</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>29</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>30</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>31</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section class="has-padding" style:margin="var(--spacing)">
            <h3>May</h3>

            <table>
                <thead>
                    <tr>
                        <th class="is-text-left">Mo</th>
                        <th class="is-text-left">Di</th>
                        <th class="is-text-left">Mi</th>
                        <th class="is-text-left">Do</th>
                        <th class="is-text-left">Fr</th>
                        <th class="is-text-left">Sa</th>
                        <th class="is-text-left">So</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>1</span> <span style:color="blue">N</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>2</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>3</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>4</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>5</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>6</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>7</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>8</span> <span style:color="orange">S</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>9</span> <span style:color="blue">Nacht</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>10</span> <span style:color="red">K</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>11</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>12</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>13</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>14</span> <span style:color="magenta">Ka</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>15</span> <span style:color="green">F</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>16</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>17</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>18</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>19</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>20</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>21</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>22</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>23</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>24</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>25</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>26</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>27</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>28</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>29</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>30</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>31</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section class="has-padding" style:margin="var(--spacing)">
            <h3>Juni</h3>

            <table>
                <thead>
                    <tr>
                        <th class="is-text-left">Mo</th>
                        <th class="is-text-left">Di</th>
                        <th class="is-text-left">Mi</th>
                        <th class="is-text-left">Do</th>
                        <th class="is-text-left">Fr</th>
                        <th class="is-text-left">Sa</th>
                        <th class="is-text-left">So</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>1</span> <span style:color="blue">N</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>2</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>3</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>4</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>5</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>6</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>7</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>8</span> <span style:color="orange">S</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>9</span> <span style:color="blue">Nacht</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>10</span> <span style:color="red">K</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>11</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>12</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>13</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>14</span> <span style:color="magenta">Ka</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>15</span> <span style:color="green">F</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>16</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>17</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>18</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>19</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>20</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>21</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>22</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>23</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>24</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>25</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>26</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>27</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>28</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>29</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>30</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>31</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section class="has-padding" style:margin="var(--spacing)">
            <h3>July</h3>

            <table>
                <thead>
                    <tr>
                        <th class="is-text-left">Mo</th>
                        <th class="is-text-left">Di</th>
                        <th class="is-text-left">Mi</th>
                        <th class="is-text-left">Do</th>
                        <th class="is-text-left">Fr</th>
                        <th class="is-text-left">Sa</th>
                        <th class="is-text-left">So</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>1</span> <span style:color="blue">N</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>2</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>3</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>4</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>5</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>6</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>7</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>8</span> <span style:color="orange">S</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>9</span> <span style:color="blue">Nacht</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>10</span> <span style:color="red">K</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>11</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>12</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>13</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>14</span> <span style:color="magenta">Ka</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>15</span> <span style:color="green">F</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>16</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>17</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>18</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>19</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>20</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>21</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>22</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>23</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>24</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>25</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>26</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>27</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>28</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>29</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>30</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>31</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section class="has-padding" style:margin="var(--spacing)">
            <h3>August</h3>

            <table>
                <thead>
                    <tr>
                        <th class="is-text-left">Mo</th>
                        <th class="is-text-left">Di</th>
                        <th class="is-text-left">Mi</th>
                        <th class="is-text-left">Do</th>
                        <th class="is-text-left">Fr</th>
                        <th class="is-text-left">Sa</th>
                        <th class="is-text-left">So</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>1</span> <span style:color="blue">N</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>2</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>3</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>4</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>5</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>6</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>7</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>8</span> <span style:color="orange">S</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>9</span> <span style:color="blue">Nacht</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>10</span> <span style:color="red">K</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>11</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>12</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>13</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>14</span> <span style:color="magenta">Ka</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>15</span> <span style:color="green">F</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>16</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>17</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>18</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>19</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>20</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>21</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>22</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>23</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>24</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>25</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>26</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>27</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>28</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>29</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>30</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>31</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section class="has-padding" style:margin="var(--spacing)">
            <h3>September</h3>

            <table>
                <thead>
                    <tr>
                        <th class="is-text-left">Mo</th>
                        <th class="is-text-left">Di</th>
                        <th class="is-text-left">Mi</th>
                        <th class="is-text-left">Do</th>
                        <th class="is-text-left">Fr</th>
                        <th class="is-text-left">Sa</th>
                        <th class="is-text-left">So</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>1</span> <span style:color="blue">N</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>2</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>3</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>4</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>5</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>6</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>7</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>8</span> <span style:color="orange">S</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>9</span> <span style:color="blue">Nacht</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>10</span> <span style:color="red">K</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>11</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>12</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>13</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>14</span> <span style:color="magenta">Ka</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>15</span> <span style:color="green">F</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>16</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>17</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>18</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>19</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>20</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>21</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>22</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>23</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>24</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>25</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>26</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>27</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>28</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>29</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>30</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>31</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section class="has-padding" style:margin="var(--spacing)">
            <h3>Oktober</h3>

            <table>
                <thead>
                    <tr>
                        <th class="is-text-left">Mo</th>
                        <th class="is-text-left">Di</th>
                        <th class="is-text-left">Mi</th>
                        <th class="is-text-left">Do</th>
                        <th class="is-text-left">Fr</th>
                        <th class="is-text-left">Sa</th>
                        <th class="is-text-left">So</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>1</span> <span style:color="blue">N</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>2</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>3</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>4</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>5</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>6</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>7</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>8</span> <span style:color="orange">S</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>9</span> <span style:color="blue">Nacht</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>10</span> <span style:color="red">K</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>11</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>12</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>13</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>14</span> <span style:color="magenta">Ka</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>15</span> <span style:color="green">F</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>16</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>17</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>18</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>19</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>20</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>21</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>22</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>23</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>24</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>25</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>26</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>27</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>28</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>29</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>30</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>31</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section class="has-padding" style:margin="var(--spacing)">
            <h3>November</h3>

            <table>
                <thead>
                    <tr>
                        <th class="is-text-left">Mo</th>
                        <th class="is-text-left">Di</th>
                        <th class="is-text-left">Mi</th>
                        <th class="is-text-left">Do</th>
                        <th class="is-text-left">Fr</th>
                        <th class="is-text-left">Sa</th>
                        <th class="is-text-left">So</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>1</span> <span style:color="blue">N</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>2</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>3</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>4</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>5</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>6</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>7</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>8</span> <span style:color="orange">S</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>9</span> <span style:color="blue">Nacht</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>10</span> <span style:color="red">K</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>11</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>12</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>13</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>14</span> <span style:color="magenta">Ka</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>15</span> <span style:color="green">F</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>16</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>17</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>18</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>19</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>20</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>21</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>22</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>23</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>24</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>25</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>26</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>27</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>28</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>29</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>30</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>31</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section class="has-padding" style:margin="var(--spacing)">
            <h3>Dezember</h3>

            <table>
                <thead>
                    <tr>
                        <th class="is-text-left">Mo</th>
                        <th class="is-text-left">Di</th>
                        <th class="is-text-left">Mi</th>
                        <th class="is-text-left">Do</th>
                        <th class="is-text-left">Fr</th>
                        <th class="is-text-left">Sa</th>
                        <th class="is-text-left">So</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-center"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>1</span> <span style:color="blue">N</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>2</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>3</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>4</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>5</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>6</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>7</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>8</span> <span style:color="orange">S</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>9</span> <span style:color="blue">Nacht</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>10</span> <span style:color="red">K</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>11</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>12</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>13</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>14</span> <span style:color="magenta">Ka</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>15</span> <span style:color="green">F</span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>16</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>17</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>18</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>19</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>20</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>21</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>22</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>23</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>24</span> <span style:color="green">F</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>25</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>26</span> <span style:color="orange">S</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>27</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>28</span> <span style:color="blue">N</span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>29</span> <span style:color="transparent"></span></div></td>
                    </tr>
                    <tr>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>30</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"><span>31</span> <span style:color="transparent"></span></div></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                        <td class="is-text-left"><div class="is-max-width flex column"></td>
                    </tr>
                </tbody>
            </table>
        </section>
    </div>

    <section>
        <Button.Root
            on:click={() => {
                const el = document.getElementById("pdf-content");
                pdf.html(el, {
                    callback: (doc) => {
                        doc.save();
                    },
                    width: 190,
                    windowWidth: 440, //window width in CSS pixels
                });
            }}
        >
            Print
        </Button.Root>
    </section>
</div>

<style>
    table {
        width: 100%;
        table-layout: fixed;
    }

    tbody td {
        height: calc(3em);
    }

    td {
        width: calc(100% / 7);
    }

    td span {
        display: block;
    }

    td span:nth-child(1) {
        font-size: 0.85em;
        font-weight: lighter;
    }

    td span:nth-child(2) {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.9em;
    }
</style>
